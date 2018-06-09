pragma solidity ^0.4.17;


/*
* Persistent URL Shortener 
* Lives forever on the Blockchain
*/

contract PersistentBit {
    
    /*
    * Struct mapping actual URL to shortened form
    */
    
    struct Shortened_url {
        string shortUrl; 
        string longUrl;
        address owner;
    }
    
    mapping (string => Shortened_url) urls;
    
    event onNewBitly (
        string shortUrl,
        string longUrl,
        address ownerAddress
    );
    
    /*
    * ensure that the shortenedUrl has not been used before
    */
    
    modifier notUsed(string url){
        require(
            keccak256(urls[url].shortUrl) != keccak256(url)
        );
        _;
    }
    
    function PersistentBit() public {
        
    }
    
    /*
    * generate new Bit.ly URL
    */
    
    function newUrl(string _shortUrl, string _longUrl) public notUsed(_shortUrl){
        urls[_shortUrl] = Shortened_url(_shortUrl, _longUrl, msg.sender);
        emit onNewBitly(_shortUrl, _longUrl, msg.sender);
    }
    
    /*
    * retrieve the Bitly url
    */
    
    function getUrl(string _shortUrl) constant returns(string _longUrl){
        return(urls[_shortUrl].longUrl);
    } 

}