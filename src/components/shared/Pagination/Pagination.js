/* @flow */
import React from 'react';
import './Pagination.css';

function Pagination(props: {
    pageSize: number,
    activePage: number,
    numberOfElements: number,
    onPagingChange: ({ activePage: number, pageSize: number }) => void,
}) {
    const { pageSize, activePage, numberOfElements } = props;
    const numberOfPages = Math.ceil(numberOfElements / pageSize);
    return (
        <div className="pagination">
            {numberOfPages > 1 && (
                <div className="paging">
                    <button
                        className="nav-button"
                        disabled={activePage === 1}
                        onClick={() => changeActivePageNumberTo(activePage - 1)}
                    >
                        previous
                    </button>

                    {pagingNumbers(numberOfPages).map((pagingNumberString, index) => {
                        return pagingNumberString === '...' ? (
                            <span className="dots" key={`pageButton${index}`}>
                                {pagingNumberString}
                            </span>
                        ) : (
                            <button
                                className={`number-button ${String(activePage) === pagingNumberString ? 'active' : ''}`}
                                key={`pageButton${index}`}
                                onClick={() => changeActivePageNumberTo(Number(pagingNumberString))}
                            >
                                {pagingNumberString}
                            </button>
                        );
                    })}

                    <button
                        className="nav-button"
                        disabled={activePage === numberOfPages}
                        onClick={() => changeActivePageNumberTo(activePage + 1)}
                    >
                        next
                    </button>
                </div>
            )}
        </div>
    );

    function changeActivePageNumberTo(newActivePage: number) {
        props.onPagingChange({ activePage: newActivePage, pageSize: props.pageSize });
    }

    function pagingNumbers(numberOfPages: number) {
        if (numberOfPages <= 7) {
            return generateNumber(1, numberOfPages);
        }

        const activePage = props.activePage;

        if (activePage < 5) {
            return [...generateNumber(1, 5), '...', String(numberOfPages)];
        }

        if (activePage < numberOfPages - 3) {
            return ['1', '...', ...generateNumber(activePage - 1, activePage + 1), '...', String(numberOfPages)];
        }

        return ['1', '...', ...generateNumber(numberOfPages - 4, numberOfPages)];

        function generateNumber(from: number, to: number): string[] {
            return Array.from(Array(to - from + 1).keys()).map(i => String(i + from));
        }
    }
}
export default Pagination;
