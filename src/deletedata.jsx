import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Deletedata() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState({});
  const [products, setProducts] = useState([]);
  const { control, handleSubmit, setValue, register, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('questionjson.json')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        if (data.length > 0) {
          setValue('Company_Id', data[0].Company_Id);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [setValue]);

  const handleDeleteClick = product => {
    setProductToDelete({ Company_Id: product.Company_Id, Serial_Number: product.Serial_Number });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const { Company_Id, Serial_Number } = productToDelete;
      const response = await fetch(`http://localhost:3000/api/deleteProduct/${Company_Id}/${Serial_Number}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Item deleted successfully');
        setProducts(products.filter(product => product.Company_Id !== Company_Id || product.Serial_Number !== Serial_Number));
        setShowDeleteModal(false);
        navigate('/dashboard');
      } else {
        toast.error('Error deleting item');
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting item');
      setShowDeleteModal(false);
    }
  };

  const handleEditClick = product => {
    setProductToEdit(product);
    setShowEditModal(true);
    reset(product);
  };

  const handleEditConfirm = async data => {
    try {
      const response = await fetch(`http://localhost:3000/api/editProduct/${data.Company_Id}/${data.Serial_Number}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success('Item updated successfully');
        setProducts(products.map(product => (product.Company_Id === data.Company_Id && product.Serial_Number === data.Serial_Number ? data : product)));
        setShowEditModal(false);
      } else {
        toast.error('Error updating item');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating item');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Paper Code</th>
              <th scope="col" className="px-6 py-3">Serial Number</th>
              <th scope="col" className="px-6 py-3">Section</th>
              <th scope="col" className="px-6 py-3">Question</th>
              <th scope="col" className="px-6 py-3">Option 1</th>
              <th scope="col" className="px-6 py-3">Option 2</th>
              <th scope="col" className="px-6 py-3">Option 3</th>
              <th scope="col" className="px-6 py-3">Option 4</th>
              <th scope="col" className="px-6 py-3">Right Answer</th>
              <th scope="col" className="px-6 py-3"><span>Edit</span></th>
              <th scope="col" className="px-6 py-3"><span>Delete</span></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.Company_Id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {product.Paper_Code}
                </th>
                <td className="px-6 py-4">{product.Serial_Number}</td>
                <td className="px-6 py-4">{product.Section}</td>
                <td className="px-6 py-4">{product.Add_Question}</td>
                <td className="px-6 py-4">{product.Option_1}</td>
                <td className="px-6 py-4">{product.Option_2}</td>
                <td className="px-6 py-4">{product.Option_3}</td>
                <td className="px-6 py-4">{product.Option_4}</td>
                <td className="px-6 py-4">{product.Right_Answer}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div id="deleteModal" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50">
          <div className="relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative p-4 text-center bg-gray-800 rounded-lg shadow sm:p-5">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setShowDeleteModal(false)}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Are you sure?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">You are about to delete this product. This cannot be undone:</p>
              <ul className="text-left mb-4">
                <li className="flex items-center text-gray-500 dark:text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9 4a1 1 0 102 0V7a1 1 0 10-2 0v7zM9 4a1 1 0 112 0v1a1 1 0 11-2 0V4z" clipRule="evenodd"></path>
                  </svg>
                  <span><b>Paper Code:</b> {productToDelete.Company_Id}</span>
                </li>
                <li className="flex items-center text-gray-500 dark:text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9 4a1 1 0 102 0V7a1 1 0 10-2 0v7zM9 4a1 1 0 112 0v1a1 1 0 11-2 0V4z" clipRule="evenodd"></path>
                  </svg>
                  <span><b>Serial Number:</b> {productToDelete.Serial_Number}</span>
                </li>
              </ul>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div id="editModal" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50">
          <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
            <div className="relative bg-gray-800 rounded-lg shadow">
              <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-90 text-white">
                  Edit Question
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => setShowEditModal(false)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleSubmit(handleEditConfirm)}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-white ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400" hidden>Company Id</label>
                      <Controller
                        name="Company_Id"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="hidden" {...field} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400" hidden>Serial Number</label>
                      <Controller
                        name="Serial_Number"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="hidden" {...field} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Section</label>
                      <Controller
                        name="Section"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="text" {...field} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Question</label>
                      <Controller
                        name="Add_Question"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="text" {...field} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Option 1</label>
                      <Controller
                        name="Option_1"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="text" {...field} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Option 2</label>
                      <Controller
                        name="Option_2"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="text" {...field} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Option 3</label>
                      <Controller
                        name="Option_3"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="text" {...field} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Option 4</label>
                      <Controller
                        name="Option_4"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="text" {...field} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">Right Answer</label>
                      <Controller
                        name="Right_Answer"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="text" {...field} className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Deletedata;
