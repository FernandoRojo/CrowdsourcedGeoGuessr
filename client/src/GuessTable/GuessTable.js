import './GuessTable.css';
import Tabulator from 'tabulator-tables'

import React from 'react';

class GuessTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            table: null,
        };
    }

    render() {
        return (
            <div className="guess-table">
               <div id="guess-table">
               </div>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        let guesses = this.props.countryGuesses
        if (guesses && this.state.table){
            let tabledata = []
                guesses.forEach((value, key) => {
                    tabledata.push({ Country: key, count: value })
                })
                this.state.table.setData(tabledata)
            }
    }

    componentDidMount() {
       console.log(this.props.countryGuesses)
        var tabledata = [{country: "kenya", count: 0}]
        this.props.countryGuesses.forEach((value, key) => {
            tabledata.push({ Country: key, count: value })
        })
                

        //initialize table
        var table = new Tabulator("#guess-table", {
            data:tabledata,           //load row data from array
            layout:"fitColumns",      //fit columns to width of table
            responsiveLayout:"hide",  //hide columns that dont fit on the table
            tooltips:true,            //show tool tips on cells
            addRowPos:"top",          //when adding a new row, add it to the top of the table
            history:true,             //allow undo and redo actions on the table
            pagination:"local",       //paginate the data
            paginationSize:7,         //allow 7 rows per page of data
            movableColumns:true,      //allow column order to be changed
            resizableRows:true,       //allow row order to be changed
            initialSort:[             //set the initial sort order of the data
                {column:"count", dir:"desc"},
            ],
            autoColumns:true, //create columns from data field names
        });
        this.setState({table: table})

    }

}

export default GuessTable;
