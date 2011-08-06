class Inegi < ActiveRecord::Base
  require 'rgeo/geo_json'
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

  def self.all_location_to_geoJson(conditions = nil)
    entity_factory = ::RGeo::GeoJSON::EntityFactory.instance
    features = []
    self.all(:conditions => conditions).each do |inegi|
      features.push(entity_factory.feature(inegi.point,inegi.id,{
        'cve_ent' => inegi.cve_ent,
        'nom_ent' => inegi.nom_ent,
        'cve_mun' => inegi.cve_mun,
        'nom_mun' => inegi.nom_mun,
        'cve_loc' => inegi.cve_loc,
        'nom_loc' => inegi.nom_loc}))
    end
    RGeo::GeoJSON.encode(entity_factory.feature_collection(features)).to_json
  end


  def self.spatial_mean(attr)
    @spatial_mean_lat=0
    @spatial_mean_lon=0
    self.select(attr, point).each do |inegi|
      @spatial_mean_lat+=inegi.attributes[attr]*inegi.latitude
      @spatial_mean_lon+=inegi.attributes[attr]*inegi.longitude
    end
    [{:description => "Media espacial de la variable "+ attr,:title=> "Media espacial "+attr,:lng => (@spatial_mean_lon/InegiEntitie.all.sum(&attr.to_sym)).to_s,:lat =>(@spatial_mean_lat/InegiEntitie.all.sum(&attr.to_sym)).to_s,:picture => "/images/marker_spatial.png" }].to_json
  end

end
