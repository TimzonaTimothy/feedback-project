// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract FeedbackContract {
    uint256 totalfeeds;

    struct Feed {
        address feeder;
        string message;
        uint256 timestamp;
    }

    Feed[] feeds;

    //function to send a feedback
    function feed(string memory _message) external {
        feeds.push(Feed(msg.sender, _message, block.timestamp));
        totalfeeds += 1;
    }

    //function to get the feedbacks
    function getFeeds() public view returns (Feed[] memory){
        return feeds;
    }

    //function to get the total feedbacks
    function getTotalFaves() public view returns(uint256){
        return totalfeeds;
    }

}