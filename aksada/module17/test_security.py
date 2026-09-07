from security import hash_value


def test_hash_value():
    result = hash_value("cryptotrace")

    assert isinstance(result, str)
    assert len(result) == 64


def test_same_input_same_hash():
    assert hash_value("wallet") == hash_value("wallet")


def test_different_input_different_hash():
    assert hash_value("wallet1") != hash_value("wallet2")