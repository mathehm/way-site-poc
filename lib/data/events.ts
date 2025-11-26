/**
 * Mock de eventos por tenant
 *
 * Em produção, isso viria de um banco de dados
 */

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

const eventsData: Record<string, Event[]> = {
  ch_01: [
    {
      id: "evt_01_01",
      title: "Culto de Celebração",
      description: "Venha celebrar conosco em um momento especial de louvor e adoração.",
      date: "2025-12-01",
      time: "19:00",
      location: "Templo Central - Igreja A",
    },
    {
      id: "evt_01_02",
      title: "Encontro de Jovens",
      description: "Momento exclusivo para jovens com dinâmicas e estudos bíblicos.",
      date: "2025-12-05",
      time: "20:00",
      location: "Salão de Eventos - Igreja A",
    },
    {
      id: "evt_01_03",
      title: "Escola Bíblica Dominical",
      description: "Estudo aprofundado da Palavra todos os domingos pela manhã.",
      date: "2025-12-08",
      time: "09:00",
      location: "Templo Central - Igreja A",
    },
  ],
  ch_02: [
    {
      id: "evt_02_01",
      title: "Vigília da Transformação",
      description: "Uma noite de oração e busca pela presença de Deus.",
      date: "2025-11-30",
      time: "22:00",
      location: "Santuário - Igreja B",
    },
    {
      id: "evt_02_02",
      title: "Café com Propósito",
      description: "Encontro matinal para networking e conexões espirituais.",
      date: "2025-12-03",
      time: "07:00",
      location: "Cafeteria da Igreja B",
    },
    {
      id: "evt_02_03",
      title: "Conferência Família Abençoada",
      description: "Três dias de ministração focada em restauração familiar.",
      date: "2025-12-10",
      time: "19:30",
      location: "Auditório Principal - Igreja B",
    },
  ],
  ch_99: [
    {
      id: "evt_99_01",
      title: "Experiência Vida",
      description: "Culto contemporâneo com louvor ao vivo e mensagem inspiradora.",
      date: "2025-12-02",
      time: "18:00",
      location: "Arena Vida",
    },
    {
      id: "evt_99_02",
      title: "Vida Kids - Aventura Bíblica",
      description: "Programa especial para crianças com atividades lúdicas e ensinamentos.",
      date: "2025-12-07",
      time: "15:00",
      location: "Espaço Vida Kids",
    },
    {
      id: "evt_99_03",
      title: "Retiro Vida Plena",
      description: "Final de semana de imersão espiritual em local paradisíaco.",
      date: "2025-12-14",
      time: "08:00",
      location: "Chácara Recanto da Paz",
    },
  ],
};

export function getEventsByChurchId(churchId: string): Event[] {
  return eventsData[churchId] || [];
}
