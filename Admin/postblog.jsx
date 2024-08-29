import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('t1', data.t1);
        formData.append('t2', data.t2);
        formData.append('t4', data.t4);
        if (data.t3[0]) {
            formData.append('t3', data.t3[0]);
        }

        try {
            const response = await axios.post("http://localhost:3000/api/posts", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                toast.success('Success Insert');
            } else {
                toast.error('Error processing request');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error submitting request');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-300 p-5">
                <div className="w-full max-w-4xl bg-gray-800 p-8 md:p-12 rounded-lg shadow-lg">
                    <h1 className="text-3xl md:text-4xl font-semibold text-center text-white mb-8">Create a New Blog Post</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-white mb-2">Title</label>
                                <input
                                    type="text"
                                    className="p-3 rounded-md border border-gray-600 bg-gray-700 text-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    {...register('t1', { required: 'Title is required' })}
                                />
                                {errors.t1 && <p className="text-red-500 text-sm mt-1">{errors.t1.message}</p>}
                            </div>

                            <div className="flex flex-col">
                                <label className="text-white mb-2">Author</label>
                                <input
                                    type="text"
                                    className="p-3 rounded-md border border-gray-600 bg-gray-700 text-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    {...register('t2', { required: 'Author is required' })}
                                />
                                {errors.t2 && <p className="text-red-500 text-sm mt-1">{errors.t2.message}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-white mb-2">Image</label>
                            <input
                                type="file"
                                className="p-3 rounded-md border border-gray-600 bg-gray-700 text-gray-300 cursor-pointer focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                {...register('t3')}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-white mb-2">Content</label>
                            <textarea
                                className="p-3 rounded-md border border-gray-600 bg-gray-700 text-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 min-h-[150px] resize-none"
                                {...register('t4', { required: 'Content is required' })}
                                rows={5} // Adjusts height dynamically based on content
                            ></textarea>
                            {errors.t4 && <p className="text-red-500 text-sm mt-1">{errors.t4.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Post'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostForm;
