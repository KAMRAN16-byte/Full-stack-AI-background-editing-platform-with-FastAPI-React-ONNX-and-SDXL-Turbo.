import { createContext, useContext, useState } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';

const ProjectContext = createContext();

export const projects = [
  {
    logo: toAbsoluteUrl('/media/app/item1.png'),
    name: 'Remove Background',
    mode: 'remove',
  },
  {
    logo: toAbsoluteUrl('/media/app/item1.png'),
    name: 'Remove & Fill Background',
    mode: 'fill',
    
  },
];

export function ProjectProvider({ children }) {
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}