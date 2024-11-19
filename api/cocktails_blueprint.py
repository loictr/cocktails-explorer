from flask import Blueprint, jsonify, request
from dependency_injector.wiring import inject, Provide
from flask_cors import cross_origin

from suggest_service import SuggestService
from repository import Repository
from containers import Container

blueprint = Blueprint("cocktails", __name__, url_prefix="/api/cocktails")



@blueprint.route('', methods=['GET'])
#@cross_origin()
@inject
def get_cocktails(repository: Repository=Provide[Container.repository]):
    return jsonify(repository.get_cocktails())


@blueprint.route('/<string:id>', methods=['GET'])
@inject
def get_cocktail(id, repository: Repository=Provide[Container.repository]):
    cocktail = repository.get_cocktail_details(id)
    if cocktail:
        return jsonify(cocktail)
    return jsonify({"error": "Cocktail not found"}), 404


@blueprint.route('/suggestions', methods=['POST'])
@inject
def suggest(suggest_service: SuggestService=Provide[Container.suggest_service]):
    request_data = request.get_json()
    suggested = suggest_service.suggest(request_data['liked_ids'], 5)
    return jsonify(suggested)