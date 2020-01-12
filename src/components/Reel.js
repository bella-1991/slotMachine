import React, { Component } from 'react'

class Reel extends Component {
    constructor(props) {
        super(props)
    } 
    
    render() {
        const { reelItem, selectedReel } = this.props

        return (
            <div className="slot__reel">
                {
                    reelItem.map((reelEach, index) => 
                        <div className={index === selectedReel.index ? "slot__reel-option slot__reel-option--active" : "slot__reel-option"} key={index}>
                            <div className="slot__reel-content">
                                {reelEach.name}
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
    
}

export default Reel