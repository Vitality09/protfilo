import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import GalaxyBackground from './components/GalaxyBackground';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import VisitorCounter from './components/VisitorCounter';

function App() {
  return (
    <Router>
      <GalaxyBackground />
      <div className="relative z-10">
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <>
                <main className="relative min-h-screen bg-black">
                  <Canvas>
                    <Suspense fallback={null}>
                      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <OrbitControls enableZoom={false} />
                    </Suspense>
                  </Canvas>
                  <Hero />
                  <div id="projects" className="py-20">
                    <Projects />
                  </div>
                  <div className="py-20">
                    <Skills />
                  </div>
                  <div id="contact" className="py-20">
                    <Contact />
                  </div>
                  <VisitorCounter />
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
