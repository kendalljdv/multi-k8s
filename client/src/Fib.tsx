import { useEffect, useState } from "react";

import axios from "axios";

// import React from 'react'

export const Fib = () => {

    interface Props {
        seenIndexes: [],
        values: { [key: string]: any };
        index: string;
    }

    const [fib, setFib] = useState<Props>({
        seenIndexes: [],
        values: {},
        index: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const valuesResponse = await axios.get('/api/values/current');
                const seenIndexesResponse = await axios.get('/api/values/all');

                console.log(seenIndexesResponse.data);
                console.log(valuesResponse.data);


                const seenIndexesResponseData = seenIndexesResponse.data.map((element: { number: any; }) => element.number);

                setFib({
                    ...fib,
                    seenIndexes: seenIndexesResponseData,
                    values: valuesResponse.data
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);



    const renderSeenIndexes = () => {
        return fib.seenIndexes.map(index => <div key={index}>{index}</div>);
    }

    const renderValues = () => {
        const entries = [];

        for (let key in fib.values) {
            entries.push(
                <div key={key}>
                    For Index {key} I calculated {fib.values[key]}
                </div>
            );
        }

        return entries;
    }


    const handleSubmit = async (event: any) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: fib.index
        });

        setFib({
            ...fib,
            index: ''
        })

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label >Enter your index: </label>
                <input
                    value={fib.index}
                    onChange={event => setFib({
                        ...fib,
                        index: event.target.value
                    })
                    }
                />
                <button>Submit</button>
            </form>

            <h3>Indexes I have seen: </h3>
            {renderSeenIndexes()}

            <h3>Calculated Values</h3>
            {renderValues()}

        </div>
    )
}



