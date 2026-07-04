import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className='mx-auto max-w-2xl rounded-3xl bg-white p-12 shadow-xl text-center'>
    <h2 className='text-4xl font-semibold text-slate-900'>404</h2>
    <p className='mt-4 text-slate-600'>We couldn't find the page you're looking for.</p>
    <Link to='/' className='mt-8 inline-flex rounded-2xl bg-brand px-6 py-3 text-white'>Back to home</Link>
  </div>
);

export default NotFoundPage;
