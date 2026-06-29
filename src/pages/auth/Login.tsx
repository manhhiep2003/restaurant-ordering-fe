import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../queries/useAuthQueries';
import { useAuthStore } from '../../store/auth.store';
import { Loader2, ChefHat } from 'lucide-react';
import { useEffect } from 'react';

const loginSchema = z.object({
  username: z.string().min(1, 'Tên đăng nhập không được để trống'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  const { mutate: login, isPending, isError, error } = useLogin();

  // Nếu đã đăng nhập rồi thì đá thẳng vào trong, không cho ở lại trang Login
  useEffect(() => {
    if (isAuthenticated && user) {
      // Dựa vào role để vào trang phù hợp
      if (user.role === 'KITCHEN') navigate('/dashboard/kitchen');
      else navigate('/dashboard/tables');
    }
  }, [isAuthenticated, user, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: (res: any) => {
        // Điều hướng dựa vào Role sau khi login thành công
        if (res.user.role === 'KITCHEN') navigate('/dashboard/kitchen');
        else navigate('/dashboard/tables');
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-gray-100">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <ChefHat size={32} />
        </div>
        <h1 className="text-2xl font-black tracking-wider text-orange-600">
          THUCDON<span className="text-gray-800">.COM</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">Đăng nhập hệ thống quản lý</p>
      </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <input
              {...register('username')}
              type="text"
              className={`w-full rounded-lg border p-3 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: staff1"
            />
            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              {...register('password')}
              type="password"
              className={`w-full rounded-lg border p-3 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {isError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              Sai tên đăng nhập hoặc mật khẩu!
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-lg bg-orange-600 py-3.5 font-bold text-white transition-all hover:bg-orange-700 active:scale-95 disabled:bg-orange-400"
          >
            {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Đăng Nhập'}
          </button>
        </form>
    </div>
  );
};

export default Login;