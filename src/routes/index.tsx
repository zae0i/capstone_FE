import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Dashboard from '@/pages/Dashboard';
import TransactionHistory from '@/pages/TransactionHistory';
import TransactionSubmission from '@/pages/TransactionSubmission';
import MyPage from '@/pages/MyPage';
import Ranking from '@/pages/Ranking';
import Report from '@/pages/Report';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import PrivateRoute from './PrivateRoute';
import KakaoPaySuccess from '@/pages/KakaoPaySuccess';
import KakaoPayCancel from '@/pages/KakaoPayCancel';
import KakaoPayFail from '@/pages/KakaoPayFail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/transactions',
        element: <TransactionHistory />,
      },
      {
        path: '/submission',
        element: <TransactionSubmission />,
      },
      {
        path: '/ranking',
        element: <Ranking />,
      },
      {
        path: '/report',
        element: <Report />,
      },
      {
        path: '/mypage',
        element: <MyPage />,
      },
      {
        path: '/admin',
        element: <Admin />,
      },
      {
        path: '/payment/success/:txId',
        element: <KakaoPaySuccess />,
      },
      {
        path: '/payment/cancel',
        element: <KakaoPayCancel />,
      },
      {
        path: '/payment/fail',
        element: <KakaoPayFail />,
      },
    ],
  },
  {
  path: '*',
    element: <NotFound />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
