class AddAttributesToIntervention < ActiveRecord::Migration
  def change
    add_column :interventions, :title, :string
    add_column :interventions, :start, :datetime
    add_column :interventions, :end, :datetime
    add_column :interventions, :description, :string
    add_column :interventions, :index, :integer
    add_column :interventions, :type, :string
    add_column :interventions, :chart_type, :string
    add_reference :interventions, :user, index: true
  end
end
