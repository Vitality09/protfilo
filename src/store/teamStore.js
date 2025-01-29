import create from 'zustand';

export const useTeamStore = create((set) => ({
  teamMembers: [],
  addTeamMember: (member) => set((state) => ({ 
    teamMembers: [...state.teamMembers, { ...member, id: Date.now() }] 
  })),
  removeTeamMember: (id) => set((state) => ({ 
    teamMembers: state.teamMembers.filter(member => member.id !== id) 
  })),
  updateTeamMember: (id, updatedMember) => set((state) => ({
    teamMembers: state.teamMembers.map(member => 
      member.id === id ? { ...member, ...updatedMember } : member
    )
  })),
}));
