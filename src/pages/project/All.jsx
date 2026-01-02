import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api';
import getImageSrc from '../../utils/imagePreviewHelper';
import ProjectCardSkeleton from '../../skeleton/project/ProjectCardSkeleton';
import DeleteModal from '../../components/DeleteModal';
import { Pencil, Trash2 } from 'lucide-react';

const ProjectList = () => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true); // new state
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/project`);
      setProjectData(data);
    } catch (error) {
      toast.error("Failed to Fetch Projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.post("/project/delete", { ids: [deleteModal.id] });
      toast.success("Entry deleted");
      setDeleteModal({ isOpen: false, id: null });
      fetchProjectData();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">All Projects</h1>
              <p className="text-gray-500 mt-1">Manage, edit, and monitor your portfolio performance.</p>
            </div>
            <Link to='/projects/create' className="px-6 py-2 text-sm bg-[#31b8c6] text-white rounded-lg cursor-pointer font-medium disabled:opacity-50">
              <span className="text-xl">+</span> Add New Project
            </Link>

          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
              : projectData && projectData.length > 0 ? projectData?.map((project) => (
                <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageSrc(project?.featured_image)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {project.isFeatured && (
                        <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-tighter">
                          ★ Featured
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm text-white uppercase ${project.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${project.projectType === 'client' ? 'border-purple-200 bg-purple-50 text-purple-600' :
                        project.projectType === 'startup' ? 'border-orange-200 bg-orange-50 text-orange-600' :
                          'border-blue-200 bg-blue-50 text-blue-600'
                        }`}>
                        {project.projectType.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1">{project.title}</h3>
                    <p className="text-xs text-gray-400 font-mono mb-3">/{project.slug}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {project.shortDescription}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-3 p-1 rounded hover:bg-gray-200 cursor-pointer"
                        onClick={() => navigate(`/projects/${project._id}/edit`)}>
                        <Pencil className="w-4 h-4" /> Edit</button>

                      <button className="flex items-center p-1 rounded gap-3 hover:bg-red-100 text-red-500 cursor-pointer"
                        onClick={() => setDeleteModal({ id: project._id, isOpen: true })}>
                        <Trash2 className="w-4 h-4" /> Delete</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                  {/* Title */}
                  <h2 className="text-3xl font-bold text-gray-800">
                    No Projects Found
                  </h2>

                  {/* Description */}
                  <p className="text-gray-500 text-sm max-w-md">
                    It looks like you haven’t added any projects yet. Start by creating a new project to showcase your work.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={deleteModal.isOpen}
        loading={isDeleting}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ProjectList;
