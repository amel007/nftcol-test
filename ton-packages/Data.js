module.exports = {DataContract:{abi:{"ABI version":2,"version":"2.1","header":["time","expire"],"functions":[{"name":"constructor","inputs":[{"name":"fees","type":"uint8"},{"name":"addrOwner","type":"address"},{"name":"addrStorage","type":"address"},{"name":"addrMetadata","type":"address"},{"name":"addrAuthor","type":"address"},{"name":"codeIndex","type":"cell"}],"outputs":[]},{"name":"transferOwnership","inputs":[{"name":"addrTo","type":"address"}],"outputs":[]},{"name":"newOfferSale","inputs":[{"name":"cost","type":"uint128"},{"name":"finishTime","type":"uint64"},{"name":"auction","type":"bool"}],"outputs":[]},{"name":"buyToken","inputs":[],"outputs":[]},{"name":"newBet","inputs":[],"outputs":[]},{"name":"finishAuction","inputs":[],"outputs":[]},{"name":"finishOfferSale","inputs":[],"outputs":[]},{"name":"getInfo","inputs":[],"outputs":[{"name":"addrRoot","type":"address"},{"name":"addrOwner","type":"address"},{"name":"addrData","type":"address"},{"name":"addrStorage","type":"address"},{"name":"addrMetadata","type":"address"}]},{"name":"getOwner","inputs":[],"outputs":[{"name":"addrOwner","type":"address"}]},{"name":"resolveCodeHashIndex","inputs":[{"name":"addrRoot","type":"address"},{"name":"addrOwner","type":"address"}],"outputs":[{"name":"codeHashIndex","type":"uint256"}]},{"name":"resolveIndex","inputs":[{"name":"addrRoot","type":"address"},{"name":"addrData","type":"address"},{"name":"addrOwner","type":"address"}],"outputs":[{"name":"addrIndex","type":"address"}]}],"data":[{"key":1,"name":"_id","type":"uint256"}],"events":[],"fields":[{"name":"_pubkey","type":"uint256"},{"name":"_timestamp","type":"uint64"},{"name":"_constructorFlag","type":"bool"},{"name":"_codeIndex","type":"cell"},{"name":"_addrRoot","type":"address"},{"name":"_addrOwner","type":"address"},{"name":"_addrStorage","type":"address"},{"name":"_addrMetadata","type":"address"},{"name":"_addrAuthor","type":"address"},{"name":"_id","type":"uint256"},{"name":"_fees","type":"uint8"},{"name":"_cost","type":"uint128"},{"name":"_finishTime","type":"uint64"},{"name":"_auction","type":"bool"},{"components":[{"name":"owner","type":"address"},{"name":"cost","type":"uint128"}],"name":"_bet","type":"tuple"}]},tvc:"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",code:"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"}};