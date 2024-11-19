from flask import Flask
from flask_cors import CORS

from containers import Container
import cocktails_blueprint
from cocktails_blueprint import blueprint


def create_app() -> Flask:
    container = Container()
    
    app = Flask(__name__)
    app.container = container

    


    app.register_blueprint(blueprint)
    
    container.wire(modules=[cocktails_blueprint])

    
    CORS(app) # TODO CORS in production should be more restrictive

    return app
