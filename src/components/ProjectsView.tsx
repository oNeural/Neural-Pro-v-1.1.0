import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, deleteProject } from '../utils/storage';
import { TranscriptionProject } from '../types/types';
import { FileText, Trash2, Plus, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NeuralCard } from './NeuralCard';
import { NeuralGradient } from './NeuralGradient';
import { TRANSCRIPT_FORMATS } from '../types/transcriptFormats';

export const ProjectsView: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<TranscriptionProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = () => {
      try {
        const allProjects = getAllProjects();
        const projectsList = Object.values(allProjects).sort(
          (a, b) => b.lastModified - a.lastModified
        );
        setProjects(projectsList);
        setError(null);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
      }
    };

    loadProjects();
    window.addEventListener('storage', loadProjects);
    return () => window.removeEventListener('storage', loadProjects);
  }, []);

  const handleOpenProject = (projectId: string) => {
    navigate(`/editor/${projectId}`);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
        setError(null);
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project');
      }
    }
  };

  return (
    <div className="pt-20">
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          Your Amazing Projects ✨
        </h1>
        <Link
          to="/editor"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Create Something New! 
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <NeuralCard
            key={project.id}
            className="group"
            glowIntensity="low"
          >
            <Link to={`/editor/${project.id}`} className="block p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-200 group-hover:text-cyan-500 transition-colors">
                        {project.fileName || 'Untitled Project'}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        <span>{formatDistanceToNow(project.lastModified, { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Format Tag */}
                {project.transcriptFormat && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700 w-fit">
                    <span className="text-sm text-indigo-400 font-medium">
                      {TRANSCRIPT_FORMATS[project.transcriptFormat].label}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </NeuralCard>
        ))}
      </div>

      {projects.length === 0 && !error && (
        <NeuralGradient className="text-center py-16">
          <FileText className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Projects Yet! 🎉</h2>
          <p className="text-gray-400 mb-6">
            Time to create your first awesome transcription! It's super easy, we promise! 😊
          </p>
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 rounded-lg font-medium text-white hover:bg-cyan-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Let's Create One! 🚀
          </Link>
        </NeuralGradient>
      )}
    </div>
  );
};
