import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import EditProductForm from '../EditProduct';

const EditProductPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { name, description, price, category, imageUrl } = router.query;

    if (!router.isReady) {
        return <p>Loading...</p>;
    }

    if (!id) {
        return <p>No product ID provided.</p>;  // This ensures `id` is present before rendering the form
    }

    return (
        <div>
            <EditProductForm formId={id} productId={id} productName={name} productDescription={description} productPrice={price} productCategory={category} productImageUrl={imageUrl} />
        </div>
    );
};

export default EditProductPage;
