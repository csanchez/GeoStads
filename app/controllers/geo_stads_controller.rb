class GeoStadsController < ApplicationController
  respond_to :json, :except => :show
  def show
    @json = InegiEntitie.all.to_gmaps4rails
  end

  def new
    @response=case params[:database]
    when "inegi"
     "{\"markers\":"+InegiEntitie.all.to_gmaps4rails+",\"attributes\":"+InegiEntitie.attributes_to_json+"}"
    else
    "{}"
    end
    respond_with(@response)
  end

  def spatial_mean
    respond_with(InegiEntitie.spatial_mean(params[:spatial_mean]));
  end

end
