import { Grid, TextField } from '@material-ui/core';
import React from 'react'
import BeerInfo from './BeerInfo';
/* Pagination Component 
-------------------------------------------------*/


// const propTypes = {
//   items: React.PropTypes.array.isRequired,
//   onChangePage: React.PropTypes.func.isRequired,
//   initialPage: React.PropTypes.number    
// }

const defaultProps = {
  initialPage: 1
}


class Pagination extends React.Component {
  constructor(props) {
      super(props);
      this.state = { pager: {} };
  }

  componentWillMount() {
      // set page if items array isn't empty
      if (this.props.items && this.props.items.length) {
          this.setPage(this.props.initialPage);
      }
  }

  componentDidUpdate(prevProps, prevState) {
      // reset page if items array has changed
      if (this.props.items !== prevProps.items) {
          this.setPage(this.props.initialPage);
      }
  }

  setPage(page) {
      var items = this.props.items;
      var pager = this.state.pager;

      if (page < 1 || page > pager.totalPages) {
          return;
      }

      // get new pager object for specified page
      pager = this.getPager(items.length, page);
      this.setState({ pager: pager });

      // get new page of items from items array
      // update state
    //   if(this.props.searchTxt){
    //     console.log('search txt', this.props.searchTxt)
    //       var tempItems = items.slice(pager.startIndex, pager.endIndex + 1);
    //     console.log('this.state.pageOfItems', this.state)
    //     console.log('this.props', this.props)
    //     var filteredArr = tempItems.filter(i=>i.name.match(this.props.searchTxt) || i.style.match(this.props.searchTxt))
    //     console.log('filteredArr', filteredArr)
    //     var items = filteredArr == null ? tempItems : filteredArr;
    //       this.props.onChangePage(items);
    //   }else{
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    //   }
  }

  getPager(totalItems, currentPage, pageSize) {
      // default to first page
      currentPage = currentPage || 1;

      // default page size is 10
      pageSize = pageSize || 20;

      // calculate total pages
      var totalPages = Math.ceil(totalItems / pageSize);

      var startPage, endPage;
      if (totalPages <= 20) {
          // less than 10 total pages so show all
          startPage = 1;
          endPage = totalPages;
      } else {
          // more than 10 total pages so calculate start and end pages
          if (currentPage <= 6) {
              startPage = 1;
              endPage = 10;
          } else if (currentPage + 4 >= totalPages) {
              startPage = totalPages - 9;
              endPage = totalPages;
          } else {
              startPage = currentPage - 5;
              endPage = currentPage + 4;
          }
      }

      // calculate start and end item indexes
      var startIndex = (currentPage - 1) * pageSize;
      var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

      // create an array of pages to ng-repeat in the pager control
      var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

      // return object with all pager properties required by the view
      return {
          totalItems: totalItems,
          currentPage: currentPage,
          pageSize: pageSize,
          totalPages: totalPages,
          startPage: startPage,
          endPage: endPage,
          startIndex: startIndex,
          endIndex: endIndex,
          pages: pages
      };
  }

  render() {
      var pager = this.state.pager;

      if (!pager.pages || pager.pages.length <= 1) {
          // don't display pager if there is only 1 page
          return null;
      }

      return (
          <ul className="pagination">
              <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                  <a onClick={() => this.setPage(1)}>First</a>
              </li>
              <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                  <a onClick={() => this.setPage(pager.currentPage - 1)}>Previous</a>
              </li>
              {pager.pages.map((page, index) =>
                  <li key={index} className={pager.currentPage === page ? 'active' : ''}>
                      <a onClick={() => this.setPage(page)}>{page}</a>
                  </li>
              )}
              <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                  <a onClick={() => this.setPage(pager.currentPage + 1)}>Next</a>
              </li>
              <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                  <a onClick={() => this.setPage(pager.totalPages)}>Last</a>
              </li>
          </ul>
      );
  }
}

Pagination.defaultProps = defaultProps;


/* App Component 
-------------------------------------------------*/

export default class PaginationComp extends React.Component {
  constructor() {
      super();
      this.state = {
          pageOfItems: [],
          beers:null,
        beersImg: [],
        filteredItems:[],
        searchTxt: null
      };

      // bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
      this.onChangePage = this.onChangePage.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/beercraft5bac38c.json').then(res => res.json())
    .then((result)=>{
        this.setState({beers: result});

    })

    fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/beerimages7e0480d.json').then(res => res.json())
    .then((result)=>{
        this.setState({beersImg: result});

    })

}

  onChangePage(pageOfItems) {
      // update state with new page of items
      this.setState({ pageOfItems: pageOfItems });
      this.setState({ filteredItems: pageOfItems });
    }
    
    
    handleInputChange = (event) => {
        const query = event.target.value;
        const regEx = new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
        this.setState({ searchTxt: regEx });
        var tempItems = this.state.pageOfItems;
        var filteredArr = tempItems.filter(i => i.name.match(regEx))
        var items = filteredArr == null ? tempItems : filteredArr;
        this.setState({ filteredItems: items });
    };



  render() {
    if(!this.state.beers && !this.state.beersImg){
      return null
  }

  var count = 0
  
      return (
          <div>
              <div className="container">
                  <div className='header'>
                      <div>
                          <a href='/'>
                              <img src='/homeImg.svg' height='50px' title='Home'/>
                          </a>
                      </div>
                      <div className='searchBox'>
                          <input type="text" id="filter" placeholder="Search for..." onChange={this.handleInputChange} />
                      </div>
                  </div>
                  <div className="text-center pt-50">
                    
                      <Grid container>
{/* {console.log(this.state.beersImg)} */}
                      {this.state.filteredItems.map(item =>{
                          count === 4 ? count = 0 : count++
                        return (
                          <>
                                <Grid  className='beerItem'>
                                    <BeerInfo imgs={this.state.beersImg} item={item} count={count}/>
                                </Grid>
                            </>
                        );
                      }
                      )}
                      </Grid>
                      <div className='pt-50'></div>
                      <div className='footerPagi'>
              <hr />
                      <Pagination items={this.state.beers} onChangePage={this.onChangePage} searchTxt={this.state.searchTxt} />
              <hr />
                      </div>
                  </div>
              </div>
             
          </div>
      );
  }
}

