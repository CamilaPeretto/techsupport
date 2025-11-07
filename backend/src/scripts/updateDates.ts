import dotenv from 'dotenv';
import connectDB from '../config/db';
import Ticket from '../models/Ticket';
import { updateTicketDates } from '../utils/updateTicketDates';

// Carrega variáveis de ambiente (caso o script seja executado isoladamente)
dotenv.config();

/**
 * Runner do script que atualiza campos de data dos tickets baseado em statusHistory.
 * Uso: node dist/scripts/updateDates.js --dry-run
 * --dry-run: apenas calcula quantos seriam atualizados sem persistir mudanças
 */
async function runner() {
  const dryRun = process.argv.includes('--dry-run');

  try {
    console.log('🔌 Conectando ao MongoDB...');
    await connectDB();
    console.log('✅ Conectado ao MongoDB!');

    if (dryRun) {
      // Modo dry-run: percorre tickets e calcula quantos precisariam de atualização
      console.log('⚠️ Modo dry-run: as alterações NÃO serão salvas. Apenas exibindo o que seria alterado.');
      const tickets = await Ticket.find({}).lean();
      console.log(`📦 Total de tickets encontrados: ${tickets.length}`);
      let wouldUpdate = 0;

      for (const ticket of tickets) {
        const updates: any = {};
        let needsUpdate = false;

        // Regra: se assignedAt não existe mas existe assignedTo, tentar inferir a data
        if (!ticket.assignedAt && ticket.assignedTo) {
          const assignedHistory = (ticket as any).statusHistory?.find(
            (h: any) => h.status === 'atribuído' || (h.assignedTechnicianName && h.assignedTechnicianName.length > 0)
          );
          if (assignedHistory) {
            updates.assignedAt = assignedHistory.changedAt;
            needsUpdate = true;
          } else {
            updates.assignedAt = ticket.updatedAt || ticket.createdAt;
            needsUpdate = true;
          }
        }

        // Se estiver em andamento/concluído e não existir inProgressAt, tentar inferir
        if (!ticket.inProgressAt && (ticket.status === 'em andamento' || ticket.status === 'concluído')) {
          const inProgressHistory = (ticket as any).statusHistory?.find((h: any) => h.status === 'em andamento');
          if (inProgressHistory) {
            updates.inProgressAt = inProgressHistory.changedAt;
            needsUpdate = true;
          } else if (ticket.assignedAt) {
            updates.inProgressAt = ticket.assignedAt;
            needsUpdate = true;
          }
        }

        // Se o ticket está concluído e não tem resolvedAt, inferir de statusHistory ou updatedAt
        if (!ticket.resolvedAt && ticket.status === 'concluído') {
          const resolvedHistory = (ticket as any).statusHistory?.find((h: any) => h.status === 'concluído');
          if (resolvedHistory) {
            updates.resolvedAt = resolvedHistory.changedAt;
            needsUpdate = true;
          } else {
            updates.resolvedAt = ticket.updatedAt;
            needsUpdate = true;
          }
        }

        if (needsUpdate) wouldUpdate++;
      }

      console.log(`🔍 Dry-run: ${wouldUpdate} tickets seriam atualizados.`);
    } else {
      // Executa a função util que faz a atualização em batch (persistente)
      await updateTicketDates();
    }

    console.log('🎉 Script concluído com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao executar updateDates:', err);
    process.exitCode = 1;
  } finally {
    // Garante que a conexão com o mongoose seja fechada no final
    try {
      const mongoose = await import('mongoose');
      await mongoose.disconnect();
      console.log('👋 Desconectado do MongoDB');
    } catch (_) {
      // se falhar ao desconectar, ignoramos para não mascarar o erro original
    }
    process.exit();
  }
}

runner();
