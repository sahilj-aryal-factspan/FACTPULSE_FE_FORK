import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function ArtifactUploadPage() {
  const { projects, uploadArtifact } = useDataStore();
  const navigate = useNavigate();

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => {
        const ext = file.name.split('.').pop()?.toUpperCase();
        return ext === 'PDF' || ext === 'PPTX' || ext === 'PPT' || ext === 'DOC' || ext === 'DOCX';
      });
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files).filter((file) => {
        const ext = file.name.split('.').pop()?.toUpperCase();
        return ext === 'PDF' || ext === 'PPTX' || ext === 'PPT' || ext === 'DOC' || ext === 'DOCX';
      });
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !selectedProjectId) return;

    setUploading(true);

    // Simulate upload progress interval
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);

        // Write each file to the store
        files.forEach((file) => {
          let type: 'PDF' | 'PPT' | 'DOC' = 'PDF';
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (ext === 'pptx' || ext === 'ppt') type = 'PPT';
          else if (ext === 'docx' || ext === 'doc') type = 'DOC';

          uploadArtifact(selectedProjectId, {
            name: file.name,
            type,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          });
        });

        setUploading(false);
        setFiles([]);
        setProgress(0);

        // Redirect to AI processing page
        navigate('/ai-workspace/processing');
      }
    }, 250);
  };

  return (
    <div
      style={{
        padding: '32px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
        <Link to="/portfolio" style={{ textDecoration: 'none', color: '#64748b' }}>
          Portfolio
        </Link>{' '}
        /
        <Link
          to="/ai-workspace"
          style={{ textDecoration: 'none', color: '#64748b', marginLeft: '6px' }}
        >
          AI Workspace
        </Link>{' '}
        /
        <span style={{ color: '#1e3a8a', fontWeight: 'bold', marginLeft: '6px' }}>
          Upload Artifacts
        </span>
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <h1 style={{ color: '#1e3a8a', margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>
          Upload Governance Artifacts
        </h1>
        <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>
          Upload meeting minutes, review decks, or Excel trackers to feed project intelligence
          memory
        </p>

        <form onSubmit={handleUploadSubmit}>
          {/* Target Project Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 600,
                fontSize: '13px',
                color: '#334155',
              }}
            >
              Select Target Delivery Project
            </label>
            <select
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              disabled={uploading}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive ? '2px dashed #d97706' : '2px dashed #cbd5e1',
              background: dragActive ? 'rgba(246, 139, 31, 0.02)' : '#f8fafc',
              borderRadius: '8px',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '24px',
              position: 'relative',
            }}
          >
            <input
              type="file"
              multiple
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
              accept=".pdf,.ppt,.pptx,.doc,.docx"
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📁</div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e3a8a' }}>
                Drag and drop your files here, or{' '}
                <span style={{ color: '#d97706', textDecoration: 'underline' }}>browse</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                Supports PDF, PPT, PPTX, DOC, DOCX up to 15MB
              </div>
            </label>
          </div>

          {/* File Lists */}
          {files.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{ fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '8px' }}
              >
                Queue for Sync ({files.length} file{files.length !== 1 ? 's' : ''})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {files.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#f1f5f9',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                    }}
                  >
                    <span style={{ color: '#1e3a8a', fontWeight: 500 }}>{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      disabled={uploading}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress bar */}
          {uploading && (
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#64748b',
                  marginBottom: '6px',
                }}
              >
                <span>Uploading and syncing to Google Drive...</span>
                <span>{progress}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: '#f1f5f9',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ width: `${progress}%`, height: '100%', background: '#d97706' }}></div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={files.length === 0 || uploading}
              style={{
                flex: 1,
                background: '#1e3a8a',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'opacity 0.2s',
                opacity: files.length === 0 || uploading ? 0.5 : 1,
              }}
            >
              {uploading ? 'Uploading...' : 'Process Artifacts'}
            </button>
            <Link
              to="/ai-workspace"
              style={{
                textDecoration: 'none',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
