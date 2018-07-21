import requests
from bs4 import BeautifulSoup
import re

# HTTP GET Request
req = requests.get('http://uos.ac.kr/food/placeList.do')

# HTML 소스 가져오기
html = req.text
# HTTP Header 가져오기
header = req.headers
# HTTP Status 가져오기 (200: 정상)
status = req.status_code
# HTTP가 정상적으로 되었는지 (True/False)
is_ok = req.ok

soup = BeautifulSoup(html, 'html.parser')
# CSS Selector를 통해 html요소들을 찾아낸다.
contents = soup.select(
    '#day > table > tbody > tr'
    )
contents = map(str,contents)

for content in contents:
	print(content) # 가져온 코드
	# 여기에 정규식 표현 사용
	reg_content = re.sub('정규식패턴','대체할텍스트',입력텍스트)
	reg_content = re.sub(r'<br/>','엔터',content)
	reg_content = re.sub(r'\(+[a-zA-Z &-;]+\)+|\<+[a-zA-Z &-;\"=/]+\>+','',reg_content)
	reg_content = re.sub(r'break time','쉬는 시간',reg_content)
	reg_content = re.sub(r'[&a-zA-Z \-;]{5,}','',reg_content)
	reg_content = re.sub(r'(엔터){3,3}','',reg_content)
	reg_content = re.sub(r'엔터','\n',reg_content)
	