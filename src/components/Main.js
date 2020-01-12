import React, { Component } from 'react'

import Reel from './Reel'
import './main.css'

const reels = [
    [{ code: 'C', name: 'cherry' }, { code: 'L', name: 'lemon' }, { code: 'A', name: 'apple' }, { code: 'L', name: 'lemon' }, { code: 'B', name: 'banana' }, { code: 'B', name: 'banana' }, { code: 'L', name: 'lemon' }, { code: 'L', name: 'lemon' }],
    [{ code: 'L', name: 'lemon' }, { code: 'A', name: 'apple' }, { code: 'L', name: 'lemon' }, { code: 'L', name: 'lemon' }, { code: 'C', name: 'cherry' }, { code: 'A', name: 'apple' }, { code: 'B', name: 'banana' }, { code: 'L', name: 'lemon' }],
    [{ code: 'L', name: 'lemon' }, { code: 'A', name: 'apple' }, { code: 'L', name: 'lemon' }, { code: 'A', name: 'apple' }, { code: 'C', name: 'cherry' }, { code: 'L', name: 'lemon' }, { code: 'B', name: 'banana' }, { code: 'L', name: 'lemon' }] 
]

class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            questionNo: "4",
            coins: 20,
            reels: reels,
            loading: false,
            spinError: false,
            addCoins: 0
        }
    }    

    componentWillMount() {
        this.spin(false)
    }

    spin = updateCoins => {
        const currentReel = this.state.reels.map(reel => {
            const randNo = this.getRandomInt(0, reel.length)
            return {
                index: randNo,
                code: reel[randNo].code,
                name: reel[randNo].name
            }
        })

        let addCoins = 0,
            coinsFor = {},
            coins = this.state.coins

        if (updateCoins) {
            const data = this.calculateCoins(currentReel)

            addCoins = data.newCoins
            coinsFor = data.coinsFor
            coins = this.state.coins + data.newCoins - 1
        }

        this.setState({ currentReel: currentReel, 
            loading: false, 
            coins: coins,
            addCoins: addCoins,
            coinsFor: coinsFor
        })
    }

    handleSpin = _ => {
        const newCoins = this.state.coins - 1
        const error = newCoins === 0 ? true : false

        this.setState({ loading: true, coins: newCoins, spinError: error })
        this.spin(true)
    }

    calculateCoins = currentReel => {
        const reelsCount = currentReel
                .map(dataItem => dataItem.name) // get all name types
                .filter((name, index, array) => array.indexOf(name) === index), // filter out duplicates

            winningCounts = reelsCount.map(name => ({
                name: name,
                count: currentReel.filter(item => item.name === name).length
            })).filter(item => item.count > 1)
        
        let newCoins = 0,
            data

        // calculate points for each winning reel
        winningCounts.map((eachCount, index) => {
            switch (eachCount.name) {
                case 'apple':
                    if (eachCount.count === 3) {
                        newCoins = 20
                    } else if (eachCount.count === 2) {
                        newCoins = 10
                    }
                    break;
                case 'banana':
                    if (eachCount.count === 3) {
                        newCoins = 15
                    } else if (eachCount.count === 2) {
                        newCoins = 5
                    }
                    break;
                case 'cherry':
                    if (eachCount.count === 3) {
                        newCoins = 50
                    } else if (eachCount.count === 2) {
                        newCoins = 40
                    }
                    break;
                case "lemon":
                    if (eachCount.count === 3) {
                        newCoins = 30
                    } 
                    break;
                default:
                    return newCoins
            }
        })

        data = {
            newCoins: newCoins,
            coinsFor: winningCounts.length ? winningCounts[0] : {}
        }

        return data
    }

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * max);
    }
    
    render() {
        const { questionNo, coins, reels, loading, currentReel, spinError, addCoins, coinsFor } = this.state

        return (            
            <div className="app">
                <h3>Slot Machine - click Spin to play</h3>
                <p>1 spin = 1 coin</p>
                <p>Match two or three similar items to win coins. (exception: 2 lemons = 0 coins)</p>
                <div className="slot">
                    <h2 className="slot__heading">Slot Machine</h2>
                    { 
                        addCoins > 0 ? 
                                <span className="success">You Won {addCoins} coins for {coinsFor.count} {coinsFor.name}s!!</span> 
                            : null
                    }
                    <p>Coins: <strong>{coins}</strong></p>
                    <div className="slot__slot-container">
                        {
                            reels.map((reelItem, index) => 
                                <Reel reelItem={reelItem} key={index} selectedReel={currentReel[index]} />
                            )
                        }
                    </div>
                    { spinError &&  <span className="error">Game over. Add more coins to play</span>}
                    <button className="btn btn-primary slot__spin-button" onClick={this.handleSpin} disabled={(coins === 0)} >Spin</button>
                </div>
            </div>
        )
    }
    
}

export default Main