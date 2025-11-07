import Ticket from '../models/Ticket';

/**
 * Atualiza campos de datas (assignedAt, inProgressAt, resolvedAt) dos tickets
 * baseado no conteúdo de statusHistory quando esses campos estão ausentes.
 * Esse util é usado pelo script src/scripts/updateDates.ts.
 */
export async function updateTicketDates() {
  try {
    console.log('🔄 Atualizando datas dos tickets...');

    const tickets = await Ticket.find({});
    console.log(`📦 Total de tickets encontrados: ${tickets.length}`);

    let updated = 0;

    for (const ticket of tickets) {
      // Colete atualizações necessárias para o ticket atual
      const updates: any = {};
      let needsUpdate = false;

      // 1) assignedAt ausente mas existe assignedTo -> tentar inferir a data
      if (!ticket.assignedAt && ticket.assignedTo) {
        const assignedHistory = ticket.statusHistory?.find(
          h => h.status === 'atribuído' || (h.assignedTechnicianName && h.assignedTechnicianName.length > 0)
        );
        if (assignedHistory) {
          updates.assignedAt = assignedHistory.changedAt;
          needsUpdate = true;
        } else {
          // fallback: usar updatedAt ou createdAt
          updates.assignedAt = ticket.updatedAt || ticket.createdAt;
          needsUpdate = true;
        }
      }

      // 2) inProgressAt ausente mas status indica em andamento/concluído
      if (!ticket.inProgressAt && (ticket.status === 'em andamento' || ticket.status === 'concluído')) {
        const inProgressHistory = ticket.statusHistory?.find(
          h => h.status === 'em andamento'
        );
        if (inProgressHistory) {
          updates.inProgressAt = inProgressHistory.changedAt;
          needsUpdate = true;
        } else if (ticket.assignedAt) {
          // fallback: usar assignedAt quando não há histórico
          updates.inProgressAt = ticket.assignedAt;
          needsUpdate = true;
        }
      }

      // 3) resolvedAt ausente mas status é concluído -> inferir data de resolução
      if (!ticket.resolvedAt && ticket.status === 'concluído') {
        const resolvedHistory = ticket.statusHistory?.find(
          h => h.status === 'concluído'
        );
        if (resolvedHistory) {
          updates.resolvedAt = resolvedHistory.changedAt;
          needsUpdate = true;
        } else {
          updates.resolvedAt = ticket.updatedAt;
          needsUpdate = true;
        }
      }

      // Persistir alterações quando necessário
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
