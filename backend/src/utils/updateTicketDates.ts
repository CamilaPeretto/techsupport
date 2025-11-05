import Ticket from '../models/Ticket';

/**
 * Script para atualizar os campos de data dos tickets existentes
 * baseado no statusHistory
 */
export async function updateTicketDates() {
  try {
    console.log('🔄 Atualizando datas dos tickets...');

    const tickets = await Ticket.find({});
    console.log(`📦 Total de tickets encontrados: ${tickets.length}`);

    let updated = 0;

    for (const ticket of tickets) {
      console.log(`\n🎫 Processando Ticket #${ticket.ticketNumber}:`);
      console.log(`  Status: ${ticket.status}`);
      console.log(`  AssignedTo: ${ticket.assignedTo ? 'Sim' : 'Não'}`);
      console.log(`  Datas atuais: assignedAt=${ticket.assignedAt}, inProgressAt=${ticket.inProgressAt}, resolvedAt=${ticket.resolvedAt}`);
      console.log(`  StatusHistory: ${ticket.statusHistory?.length || 0} entradas`);
      
      const updates: any = {};
      let needsUpdate = false;

      // Se não tem assignedAt mas tem assignedTo, pegar do statusHistory
      if (!ticket.assignedAt && ticket.assignedTo) {
        // Procurar no statusHistory quando foi atribuído
        const assignedHistory = ticket.statusHistory?.find(
          h => h.status === 'atribuído' || (h.assignedTechnicianName && h.assignedTechnicianName.length > 0)
        );
        if (assignedHistory) {
          updates.assignedAt = assignedHistory.changedAt;
          needsUpdate = true;
          console.log(`  ✓ Ticket #${ticket.ticketNumber}: assignedAt = ${assignedHistory.changedAt}`);
        } else {
          // Se não tem histórico, usar a data de criação ou updatedAt
          updates.assignedAt = ticket.updatedAt || ticket.createdAt;
          needsUpdate = true;
          console.log(`  ✓ Ticket #${ticket.ticketNumber}: assignedAt = ${updates.assignedAt} (fallback)`);
        }
      }

      // Se não tem inProgressAt mas está em andamento ou concluído
      if (!ticket.inProgressAt && (ticket.status === 'em andamento' || ticket.status === 'concluído')) {
        // Procurar no statusHistory quando mudou para "em andamento"
        const inProgressHistory = ticket.statusHistory?.find(
          h => h.status === 'em andamento'
        );
        if (inProgressHistory) {
          updates.inProgressAt = inProgressHistory.changedAt;
          needsUpdate = true;
          console.log(`  ✓ Ticket #${ticket.ticketNumber}: inProgressAt = ${inProgressHistory.changedAt}`);
        } else if (ticket.assignedAt) {
          // Se não tem histórico, usar assignedAt
          updates.inProgressAt = ticket.assignedAt;
          needsUpdate = true;
          console.log(`  ✓ Ticket #${ticket.ticketNumber}: inProgressAt = ${ticket.assignedAt} (fallback)`);
        }
      }

      // Se não tem resolvedAt mas está concluído
      if (!ticket.resolvedAt && ticket.status === 'concluído') {
        // Procurar no statusHistory quando mudou para "concluído"
        const resolvedHistory = ticket.statusHistory?.find(
          h => h.status === 'concluído'
        );
        if (resolvedHistory) {
          updates.resolvedAt = resolvedHistory.changedAt;
          needsUpdate = true;
          console.log(`  ✓ Ticket #${ticket.ticketNumber}: resolvedAt = ${resolvedHistory.changedAt}`);
        } else {
          // Se não tem histórico, usar updatedAt
          updates.resolvedAt = ticket.updatedAt;
          needsUpdate = true;
          console.log(`  ✓ Ticket #${ticket.ticketNumber}: resolvedAt = ${ticket.updatedAt} (fallback)`);
        }
      }

      // Atualizar se necessário
      if (needsUpdate) {
        await Ticket.findByIdAndUpdate(ticket._id, updates);
        updated++;
      }
    }

    console.log(`✅ Atualização concluída! ${updated} tickets atualizados de ${tickets.length} total.`);
  } catch (error) {
    console.error('❌ Erro ao atualizar datas dos tickets:', error);
    throw error;
  }
}
