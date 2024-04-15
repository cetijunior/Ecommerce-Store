/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import '@/styles/globals.css'
import Link from "next/link";

interface FormData {
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

type Props = {
    formId: string;
    productForm: FormData;
    forNewProduct?: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AddProduct = ({ formId, productForm, forNewProduct = true }: Props) => {
    const router = useRouter();
    const contentType = "application/json";
    const [errors, setErrors] = useState<Error>({});
    const [message, setMessage] = useState("");

    const [form, setForm] = useState<FormData>({
        ...productForm,
    });

    /* The PUT method edits an existing entry in the MongoDB database. */
    const putData = async (form: FormData) => {
        const { id } = router.query;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: {
                    Accept: contentType,
                    "Content-Type": contentType,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error(res.status.toString());
            }

            const { data } = await res.json();

            mutate(`/api/products/${id}`, data, false); // Update the local data without a revalidation
            router.push("/");
        } catch (error) {
            setMessage("Failed to update product");
        }
    };

    /* The POST method adds a new entry in the MongoDB database. */
    const postData = async (form: FormData) => {
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    Accept: contentType,
                    "Content-Type": contentType,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error(res.status.toString());
            }

            router.push("/");
        } catch (error) {
            setMessage("Failed to add product");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const value = target.name === "inStock" ? target.checked : target.value;
        const name = target.name;

        setForm({
            ...form,
            [name]: value,
        });
    };


    /* Validate product info */
    const formValidate = () => {
        let err: Error = {};
        if (!form.name) err.name = "Name is required";
        if (!form.description) err.description = "Description is required";
        if (!form.category) err.category = "Category is required";
        if (!form.imageUrl) err.imageUrl = "Image URL is required";
        return err;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errs = formValidate();

        if (Object.keys(errs).length === 0) {
            forNewProduct ? postData(form) : putData(form);
        } else {
            setErrors(errs);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="absolute justify-start w-full top-1 left-1">
                <Link legacyBehavior href="/admin/Admin">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Back To Admin Page
                    </button>
                </Link>
            </div>
            <div className="flex items-center justify-center w-full ">
                <form id={formId} onSubmit={handleSubmit} className='flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg'>
                    <h2 className="text-2xl font-semibold text-center mb-6">Add New Product</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="mb-4 px-3 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline"
                    />
                    <input
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
                        Add Product
                    </button>
                </form>
            </div>
            <p>{message}</p>
            {Object.keys(errors).length > 0 && (
                <div>
                    {Object.keys(errors).map((err, index) => (
                        <li key={index}>{(errors as any)[err]}</li>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddProduct;
