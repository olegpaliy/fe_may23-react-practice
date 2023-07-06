/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(c => c.id === product.categoryId);
  const user = usersFromServer.find(u => u.id === category.ownerId);

  return {
    ...product,
    categoryName: category.title,
    img: category.icon,
    userName: user.name,
    userGender: user.sex,
  };
});

export const App = () => {
  const [query, setQuery] = useState('');
  const [product, setProduct] = useState(products);
  const [selected, setSelected] = useState(undefined);

  const filterByOwner = (owner) => {
    if (owner) {
      setProduct(products.filter(item => item.userName === owner.name));
      setSelected(owner.id);
    } else {
      setProduct(products);
      setSelected(undefined);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => {
                  filterByOwner();
                }}
                data-cy="FilterAllUsers"
                href="#/"
                className={!selected ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(item => (
                <a
                  onClick={() => {
                    filterByOwner(item);
                  }}
                  key={item.id}
                  className={item.id === selected ? 'is-active' : ''}
                  data-cy="FilterUser"
                  href={`#${item.name}`}
                >
                  {item.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  onChange={event => setQuery(event.target.value.toLowerCase())}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query.length !== 0 && (
                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setQuery('')}
                  />
                </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(item => (
                <a
                  key={item.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {item.title}
                </a>
              ))}

            </div>

            <div className="panel-block">
              <a
                onClick={() => {
                  setProduct(products);
                  setQuery('');
                  setSelected(undefined);
                }}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {product.length === 0 && (
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {product
                .filter(per => per.name.toLowerCase().includes(query))
                .map(item => (
                  <tr key={item.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {item.id}
                    </td>

                    <td data-cy="ProductName">{item.name}</td>
                    <td data-cy="ProductCategory">{`${item.img} - ${item.categoryName}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={item.userGender === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'}
                    >
                      {item.userName}
                    </td>
                  </tr>
                ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};