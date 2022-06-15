import { useContext, useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../components/product-card/product-card.component';
import { gql, useQuery } from '@apollo/client';
import { CategoriesContext } from '../../contexts/categories.context';
import Spinner from '../../components/spinner/spinner.component';
import { CategoryContainer, Title } from './category.styles';

const GET_CATEGORY = gql`
	query ($title: String) {
		getCollectionsByTitle(title: $title) {
			id
			items {
				name
				price
				imageUrl
			}
		}
	}
`;
const Category = () => {
	const { category } = useParams();
	const [products, setProducts] = useState([]);
	const { loading, error, data } = useQuery(GET_CATEGORY, {
		variables: {
			title: category,
		},
	});

	useEffect(() => {
		if (data) {
			const { getCollectionsByTitle } = data;

			setProducts(getCollectionsByTitle.items);
		}
	}, [data]);

	return (
		<Fragment>
			{loading ? (
				<Spinner />
			) : (
				<>
					<Title>{category.toUpperCase()}</Title>
					<CategoryContainer>
						{products &&
							products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
					</CategoryContainer>
				</>
			)}
		</Fragment>
	);
};

export default Category;
