class ChangeYearGraduatedToBeStringInMemberRequests < ActiveRecord::Migration[5.2]
  def change
    change_column :member_requests, :year_graduated, :string
  end
end
