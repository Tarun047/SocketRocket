FROM python:3
WORKDIR /app
RUN mkdir -p /app/musicmaniac
COPY musicmaniac /app/musicmaniac
COPY manage.py /app
RUN pip install django
RUN pip install channels
EXPOSE 8000
CMD ["python", "manage.py" ,"runserver","0.0.0.0:8000"]
