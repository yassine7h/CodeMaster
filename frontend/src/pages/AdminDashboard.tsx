import Layout from '../layouts/Layout';
import { API_BASE_URL } from '../utils/HttpClient';

export default function AdminDashboard() {
   const adminpageURL = `${API_BASE_URL}/admin/`;

   return (
      <Layout>
         <div className="flex items-center justify-center w-full h-full bg-white #py-5 #px-20">
            <iframe src={adminpageURL} className="w-full h-full" allow="" />
         </div>
      </Layout>
   );
}
