import { useState, useEffect } from "react";
import '@/styles/globals.css'
import { useRouter } from "next/router";
import { mutate } from "swr";
import Link from "next/link";

interface FormData {
    _id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

interface Error {
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    imageUrl?: string;
}

const ProductForm = ({ formId }: { formId: string }) => {
    const router = useRouter();
    const { id, name: initialName, description: initialDescription, price: initialPrice, category: initialCategory, imageUrl: initialImageUrl } = router.query; // Product details from URL

    const contentType = "application/json";
    const [errors, setErrors] = useState<Error>({});
    const [message, setMessage] = useState("");
    const [form, setForm] = useState<FormData>({
        _id: id as string, // Ensuring the ID is set from the start if available
        name: initialName || '',
        description: initialDescription || '',
        price: initialPrice ? parseFloat(initialPrice as string) : 0,
        category: initialCategory || '',
        imageUrl: initialImageUrl || '',
        inStock: false
    });

    useEffect(() => {
        if (id) {
            setForm({
                ...form,
                _id: id as string,
                name: initialName || '',
                description: initialDescription || '',
                price: initialPrice ? parseFloat(initialPrice as string) : 0,
                category: initialCategory || '',
                imageUrl: initialImageUrl || ''
            });
        }
    }, [router.query]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errs = formValidate();
        setErrors(errs);

        if (Object.keys(errs).length === 0) {
            await putData(form);
        } else {
            setMessage("Please correct the errors in the form.");
        }
    };

    const putData = async (form: FormData) => {
        if (!form._id) {
            setMessage("Error: No product ID provided for update.");
            return;
        }

        try {
            const res = await fetch(`/api/products/${form._id}`, {
                method: "PUT",
                headers: {
                    Accept: contentType,
                    "Content-Type": contentType,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error(`HTTP status ${res.status}`);
            }

            const data = await res.json();
            mutate(`/api/products/${form._id}`, data, false);
            router.push("/admin/Admin");
            setMessage("Product updated successfully!");
        } catch (error) {
            console.error("Failed to update product:", error);
            setMessage("Failed to update product");
        }
    };

    function formValidate() {
        let err: Error = {};
        if (!form.name) err.name = "Name is required";
        if (!form.description) err.description = "Description is required";
        if (!form.price || form.price <= 0) err.price = "Price must be greater than zero and a number";
        if (!form.category) err.category = "Category is required";
        if (!form.imageUrl) err.imageUrl = "Image URL is required";
        return err;
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="absolute justify-start w-full top-3 left-1">
                <Link legacyBehavior href="/admin/Admin">
                    <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back To Admin Page</a>
                </Link>
            </div>
            <form id={formId} onSubmit={handleSubmit} className='flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg'>
                <h2 className="text-2xl font-semibold text-center mb-6">Edit, {form.name}</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mb-4 px-3 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="mb-4 px-3 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline h-32"
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="mb-4 px-3 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline"
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="mb-4 px-3 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline"
                />
                <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={handleChange}
                    required
                    className="mb-4 px-3 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline"
                />
                <div className="flex items-center justify-center w-full">
                    <img className="w-20 rounded-lg" src={form.imageUrl}></img>
                </div>
                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        name="inStock"
                        checked={form.inStock}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label>In Stock</label>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Edit Product
                </button>
            </form>
            {message && <p className="text-red-500">{message}</p>}
            {Object.keys(errors).length > 0 && (
                <div className="text-red-500">
                    {Object.keys(errors).map((err, index) => (
                        <li key={index}>{errors[err]}</li>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductForm;
