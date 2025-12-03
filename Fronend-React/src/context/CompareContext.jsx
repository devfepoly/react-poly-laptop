import { createContext, useState, useEffect } from 'react';
//eslint-disable-next-line react-refresh/only-export-components
export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState(() => {
        const saved = localStorage.getItem('compareList');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (product) => {
        if (compareList.length >= 4) {
            alert('Chỉ có thể so sánh tối đa 4 sản phẩm');
            return;
        }
        if (!compareList.find(item => item.id === product.id)) {
            setCompareList(prev => [...prev, product]);
        }
    };

    const removeFromCompare = (productId) => {
        setCompareList(prev => prev.filter(item => item.id !== productId));
    };

    const clearCompare = () => setCompareList([]);

    const isInCompare = (productId) => {
        return compareList.some(item => item.id === productId);
    };

    const compareCount = compareList.length;

    return (
        <CompareContext.Provider value={{
            compareList,
            addToCompare,
            removeFromCompare,
            clearCompare,
            isInCompare,
            compareCount
        }}>
            {children}
        </CompareContext.Provider>
    );
};
