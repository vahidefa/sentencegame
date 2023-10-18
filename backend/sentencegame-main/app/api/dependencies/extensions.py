import uuid

def generate_id():
    id = uuid.uuid4()
    
    id_str = str(id).replace("-", "")
    
    return id_str

def generate_fileName():
    id = uuid.uuid4()
    
    id_str = str(id).replace("-", "")
    
    return id_str

def generate_token():
    token = uuid.uuid4()
    token_str = str(token).replace("-", "")
    
    return token_str