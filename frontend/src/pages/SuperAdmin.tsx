import Layout from '../layouts/Layout';
import { API_BASE_URL } from '../utils/HttpClient';

export default function SuperAdmin() {
   const adminpageURL = `${API_BASE_URL}/admin/`;
   return (
      <Layout>
         {/* <button onClick={() => window.open(adminpageURL, '_blank', 'noopener,noreferrer')}>Open Dynamic URL</button> */}
         <div className="flex items-center justify-center w-full h-full py-5 px-20">
            <iframe src={adminpageURL} title="Admin Dashboard" className="w-full h-full border-2 border-gray-300" allow="" />
         </div>
      </Layout>
   );
}
