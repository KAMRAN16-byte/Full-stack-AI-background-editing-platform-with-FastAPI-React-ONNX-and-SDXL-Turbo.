
import { Layout32Page } from '@/pages/layout-32/page';

import { Navigate, Route, Routes } from 'react-router';
import { Layout32 } from '@/components/layouts/layout-32';


export function AppRoutingSetup() {
  return (
    <Routes>
      <Route element={<Layout32 />}>
        <Route path="/layout-32" element={<Layout32Page />} />
      </Route>

      <Route path="*" element={<Navigate to="/layout-1" replace />} />
    </Routes>
  );
}
