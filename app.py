from flask import Flask, render_template, redirect, request, url_for, session, escape

app = Flask(__name__)

@app.route('/')
def game():
    return render_template('game.html')

if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )