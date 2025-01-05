import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, MinusCircle, PlusCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const NetworkGraph = () => {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canvasRef = React.useRef(null);

  // Fetch network data from backend
  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3000/api/py/get-users");
      setNodes(response.data.nodes);
      setLinks(response.data.links);

      // Initialize view once data is loaded
      if (response.data.nodes.length > 0) {
        setTimeout(() => focusOnNode(1), 100);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching network data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchNetworkData();
  }, []);

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and center transformation
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width/2 + center.x, -canvas.height/2 + center.y);

    // Draw links
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = Math.max(1, 4);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 36, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${node.id * 50}, 70%, 50%)`;
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.stroke();

      // Draw labels
      ctx.font = '14px serif';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, node.x, node.y);
    });

    ctx.restore();
  };

  // Focus on a specific node
  const focusOnNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setCenter({ x: -node.x + 300, y: -node.y + 200 }); // Center on node
      setZoom(1); // Zoom in
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 600;
      drawNetwork();
    }
  }, [zoom, center, nodes, links]);

  // Handle mouse/touch interactions
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDragging(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragStart({ x, y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = (x - dragStart.x) / zoom;
    const dy = (y - dragStart.y) / zoom;

    setCenter(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));

    setDragStart({ x, y });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * scaleFactor, 0.1), 4));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading network data: {error}
        <Button onClick={fetchNetworkData} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button onClick={handleZoomIn} variant="outline" size="icon">
          <PlusCircle className="h-4 w-4" />
        </Button>
        <Button onClick={handleZoomOut} variant="outline" size="icon">
          <MinusCircle className="h-4 w-4" />
        </Button>
        <Button onClick={fetchNetworkData} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      />
    </>
  );
};

export default NetworkGraph;