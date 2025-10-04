module 0x6a80ea2d131e6b6b5809173cad349bd2a9fc6496d31459be76cece265122e5b5::TrustScanner {

    /// Structure to store scan results for a contract
    struct ScanResult has key {
        contract_address: address,
        trust_score: u8, // Placeholder; backend can populate this
    }

    /// Entry function: store scan result for a contract
    public entry fun store_scan_result(user: &signer, contract: address, score: u8) {
        let result = ScanResult { contract_address: contract, trust_score: score };
        move_to(user, result);
    }

    /// Read the scan result for a contract
    public fun get_scan_score(account: address): u8 acquires ScanResult {
        let result_ref = borrow_global<ScanResult>(account);
        result_ref.trust_score
    }

}
