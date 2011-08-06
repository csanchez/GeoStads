class GeoStadsController < ApplicationController
  respond_to :json, :except => :show
  def show
    #@json = Inegi.all.to_gmaps4rails
  end

  def new
  end
  
  def get_db()
    @response=case params[:database]
    when "inegi"
     "{\"markers\":"+Inegi.all_location_to_geoJson+",\"attributes\":"+Inegi.column_names[8..31].to_json+"}"      
    else
      "{}"
    end
    respond_with(@response)
  end

  def get_polygons()
    respond_with(Polygon.all_to_geoJson)
  end


  def spatial_mean
    respond_with(Inegi.spatial_mean(params[:spatial_mean]));
  end

end
