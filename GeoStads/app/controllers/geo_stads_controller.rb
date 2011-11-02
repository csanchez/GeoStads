class GeoStadsController < ApplicationController
  respond_to :json, :except => :show
  
  
  def show
  end
  
  def get_db
    @response=case params[:database]
      when "inegi"
        "{\"markers\":"+Inegi.all_location_to_geoJson(params[:values])+",\"attributes\":"+Inegi.attributes_to_json+"}"      
      else
        "{}"
      end
    respond_with(@response)
  end

  def get_polygons()
    respond_with(Polygon.all_to_geoJson)
  end


  def spatial_mean
    respond_with(Inegi.spatial_mean(params[:spatial_mean],params[:values]));
  end
  
  def nearest_neighbor
    resp = Inegi.nearest_neighbor(params[:values])
    respond_with("{\"markers\":"+RGeo::GeoJSON.encode(resp[0]).to_json+",\"prom_min\":"+resp[1].to_s+" }")    
  end
  
  def moran
    respond_with("{\"moran\":"+Inegi.moran()+"}")
  end
  
  
  

end
