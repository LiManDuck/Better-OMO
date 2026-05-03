test push

curl.exe -X POST "https://api.svips.org/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-2b1f5e6e1daac5d4fae8193c351e040b9cd155884c1437ad544ad3decebc134c" \
  -d '{
    "model": "GLM-5",
    "max_tokens": 1024,
    "system": "你是一个有用的AI助手。",
    "messages": [{"role": "user", "content": "你好，请介绍下自己。"}],
    "temperature": 1.0,
    "stream": true
  }'