pragma ton-solidity >= 0.43.0;

pragma AbiHeader expire;
pragma AbiHeader time;

import './NftRoot.sol';

contract DeployerColection {
    TvmCell _codeNftRoot;
    TvmCell _codeData;
    TvmCell _codeMetadata;
    TvmCell _codeStorage;
    TvmCell _codeIndex;

    address[] addressColections;

    constructor(
        TvmCell codeNftRoot,
        TvmCell codeData,
        TvmCell codeMetadata,
        TvmCell codeStorage,
        TvmCell codeIndex) public 
    {
        tvm.accept();
        _codeNftRoot = codeNftRoot;
        _codeData = codeData;
        _codeMetadata = codeMetadata;
        _codeStorage = codeStorage;
        _codeIndex = codeIndex;
    }

    function deployColection(address addrOwner, uint8 fees, uint128 costMint) public {
        TvmCell code = _buildNftRootState(addrOwner);
        new NftRoot{
            stateInit: code,
            value: 1.1 ton
        }(
            _codeIndex,
            _codeData,
            _codeStorage,
            _codeMetadata,
            fees,
            costMint
        );
    }

    function getAddressColections() public view returns(address[] addreses) {
        addreses = addressColections;
    }

    function resolveNftRoot(address addrOwner) public view returns(address) {
        TvmCell state = _buildNftRootState(addrOwner);
        uint256 hashState = tvm.hash(state);
        return address.makeAddrStd(0, hashState);
    }

    function _buildNftRootState(address addrOwner) internal virtual view returns(TvmCell) {
        return tvm.buildStateInit({
            contr: NftRoot,
            varInit: {_addrOwner: addrOwner},
            code: _codeNftRoot
        });
    }


}