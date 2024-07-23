import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { omit } from 'lodash';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CustomInput from 'src/components/CustomInput';
import { PATHS } from 'src/constants/navPaths';
import { RegisterFormType, RegisterSchema } from 'src/schema/AuthenticationSchema';
import authenticateSerivce from 'src/services/auth.services';
import { TCommonResponse } from 'src/types/common.type';
import { isUnprocessableEntityError } from 'src/utils/error';

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<RegisterFormType>({
        resolver: yupResolver(RegisterSchema)
    });

    const registerAccountMutation = useMutation({
        mutationFn: (body: Omit<RegisterFormType, 'confirm_password'>) => authenticateSerivce.register(body)
    });

    const onSubmit: SubmitHandler<RegisterFormType> = (data) => {
        const body = omit(data, ['confirm_password']);
        registerAccountMutation.mutate(body, {
            onSuccess: (data) => {},
            onError: (err) => {
                if (isUnprocessableEntityError<TCommonResponse<Omit<RegisterFormType, 'confirm_password'>>>(err)) {
                    const objErrorForm = err.response?.data.data;
                    if (objErrorForm) {
                        Object.keys(objErrorForm).forEach((key) => {
                            setError(key as keyof Omit<RegisterFormType, 'confirm_password'>, {
                                message: objErrorForm[key as keyof Omit<RegisterFormType, 'confirm_password'>],
                                type: 'server'
                            });
                        });
                    }
                }
            }
        });
    };

    return (
        <div className='bg-shopeeOrange'>
            <div className='mx-auto max-w-[1200px] px-4'>
                <div className='grid h-[600px] grid-cols-1 bg-main bg-contain bg-center bg-no-repeat py-5 md:grid-cols-4 lg:grid-cols-5 lg:py-[60px]'>
                    <div className='col-span-1 md:col-span-2 md:col-start-2 lg:col-span-2 lg:col-start-4'>
                        <form onSubmit={handleSubmit(onSubmit)} className='rounded bg-white p-6 shadow-sm lg:w-[400px]' noValidate>
                            {/* Header form */}
                            <div className='flex items-center justify-between'>
                                <div className='text-xl font-normal'>Đăng ký</div>
                            </div>

                            <CustomInput
                                register={register}
                                name='email'
                                type='email'
                                className='mt-7'
                                errorMessage={errors.email?.message}
                                placeholder='Email/Số điện thoại/Tên đăng nhập'
                            />

                            <CustomInput
                                register={register}
                                name='password'
                                type='password'
                                className='mt-1'
                                errorMessage={errors.password?.message}
                                placeholder='Mật khẩu'
                            />

                            <CustomInput
                                register={register}
                                name='confirm_password'
                                type='password'
                                className='mt-1'
                                errorMessage={errors.confirm_password?.message}
                                placeholder='Xác nhận mật khẩu'
                            />

                            <div className='mt-5'>
                                <button type='submit' className='h-10 w-full bg-shopeeOrange text-sm uppercase text-white'>
                                    Đăng ký
                                </button>
                            </div>

                            <div className='mt-3 flex items-center'>
                                <div className='w-full border-b'></div>
                                <div className='mx-2 text-sm uppercase text-gray-400'>Hoặc</div>
                                <div className='w-full border-b'></div>
                            </div>

                            <div className='mt-4 text-center text-sm'>
                                Bạn đã có tài khoản?{' '}
                                <Link className='text-shopeeOrange' to={PATHS.AUTH_PAGES.LOGIN}>
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
