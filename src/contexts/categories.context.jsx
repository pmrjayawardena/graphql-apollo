import { createContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { getCategoriesAndDocuments } from '../utils/firebase/firebase.utils';

export const CategoriesContext = createContext({
	categoriesMap: {},
});

const COLLECTIONS = gql`
	query {
		collections {
			id
			title
			items {
				name
				price
				imageUrl
			}
		}
	}
`;
export const CategoriesProvider = ({ children }) => {
	const { loading, error, data } = useQuery(COLLECTIONS);
	const [categoriesMap, setCategoriesMap] = useState({});

	console.log(loading);
	console.log(data);

	useEffect(() => {
		if (data) {
			const { collections } = data;
			const collectionMap = collections.reduce((acc, collection) => {
				const { title, items } = collection;
				acc[title.toLowerCase()] = items;
				return acc;
			}, {});
			setCategoriesMap(collectionMap);
		}
	}, [data]);
	// useEffect(() => {
	//   const getCategoriesMap = async () => {
	//     const categoryMap = await getCategoriesAndDocuments();
	//     setCategoriesMap(categoryMap);
	//   };

	//   getCategoriesMap();
	// }, []);

	const value = { categoriesMap, loading };
	return (
		<CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
	);
};
