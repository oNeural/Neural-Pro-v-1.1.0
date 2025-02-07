import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, File, Trash2, Plus, FileText } from 'lucide-react';
import { loadProject, deleteProject, getRecentProjects } from '../utils/storage';
import { TranscriptionProject } from '../types/types';
import { TRANSCRIPT_FORMATS } from '../types/transcriptFormats';

export const RecentProjects: React.FC = () => {
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<TranscriptionProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const projects = getRecentProjects();
      setRecentProjects(projects);
      setError(null);
    } catch (err) {
      console.error('Error loading recent projects:', err);
      setError('Failed to load recent projects');
    }
  }, []);

  const handleProjectClick = (projectId: string) => {
    try {
      const project = loadProject(projectId);
      if (project) {
        navigate(`/editor/${projectId}`);
        setError(null);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project');
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await deleteProject(projectId);
      setRecentProjects(prev => prev.filter(p => p.id !== projectId));
      setError(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatPreview = (content: string) => {
    if (!content) return '';
    return content.slice(0, 100) + (content.length > 100 ? '...' : '');
  };

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
        {error}
      </div>
    );
  }

  if (recentProjects.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/20 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-100 mb-2">Recent Projects</h2>
          <p className="text-sm text-gray-400">Continue working on your transcriptions</p>
        </div>
        <button
          onClick={() => navigate('/editor')}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-gray-900 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-cyan-500/25"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>
      
      <div className="grid gap-4">
        {recentProjects.map((project: TranscriptionProject) => (
          <div
            key={project.id}
            onClick={() => handleProjectClick(project.id)}
            className="bg-gray-900/50 hover:bg-gray-800/50 rounded-lg p-4 cursor-pointer transition-all duration-200 group border border-gray-800/50 hover:border-gray-700/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-200 truncate">
                        {project.fileName || 'Untitled Project'}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {project.transcriptFormat && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
                        <span className="text-sm text-indigo-400 font-medium">
                          {TRANSCRIPT_FORMATS[project.transcriptFormat].label}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(project.lastModified)}</span>
                    </div>
                  </div>

                  {project.content && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {formatPreview(project.content)}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteProject(e, project.id)}
                className="p-2 text-gray-500 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 