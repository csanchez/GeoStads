class InegiEntitie < ActiveRecord::Base
  acts_as_gmappable

  def gmaps4rails_address
    #describe how to retrieve the address from your model, if you use directly a db column, you can dry your code, see wiki
    self.nom_loc
  end
  
  def gmaps4rails_infowindow
    "#{cve_ent} - #{nom_ent} <br> #{cve_mun} - #{nom_mun} <br> #{cve_loc} - #{nom_loc}"
  end

  def gmaps4rails_title
      "inegi"
  end
  

  # By default, use the GEOS implementation for spatial columns.
  self.rgeo_factory_generator = RGeo::Geos.method(:factory)

  # But use a geographic implementation for the :latlon column.
  set_rgeo_factory_for_column(:point, RGeo::Geographic.spherical_factory)
  
  def latitude
    self.point.y.to_f
  end

  def longitude
    self.point.x.to_f
  end


  def self.attributes_to_json
    columns = []
    self.column_names.each do |column|
      columns.push({:attribute => column})
    end
    columns[8..31].to_json
  end

  def self.spatial_mean(attr)
    @spatial_mean_lat=0
    @spatial_mean_lon=0
    self.select(attr+", point").each do |inegi|
      @spatial_mean_lat+=inegi.attributes[attr]*inegi.latitude
      @spatial_mean_lon+=inegi.attributes[attr]*inegi.longitude
    end
    [{:description => "Media espacial de la variable "+attr,:title=> "Media espacial "+attr,:lng => (@spatial_mean_lon/InegiEntitie.all.sum(&attr.to_sym)).to_s,:lat =>(@spatial_mean_lat/InegiEntitie.all.sum(&attr.to_sym)).to_s,:picture => "/images/marker_spatial.png" }].to_json
  end

end
