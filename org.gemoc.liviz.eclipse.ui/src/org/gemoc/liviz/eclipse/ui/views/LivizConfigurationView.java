package org.gemoc.liviz.eclipse.ui.views;

import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.ColorDialog;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.ui.part.*;
import org.eclipse.jface.viewers.*;
import org.eclipse.swt.graphics.Image;
import org.eclipse.jface.action.*;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.ui.*;
import org.eclipse.swt.widgets.Menu;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
import org.eclipse.swt.widgets.TableItem;
import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.TableEditor;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;

import javax.inject.Inject;

/**
 * This sample class demonstrates how to plug-in a new workbench view. The view
 * shows data obtained from the model. The sample creates a dummy model on the
 * fly, but a real implementation would connect to the model available either in
 * this or another plug-in (e.g. the workspace). The view is connected to the
 * model using a content provider.
 * <p>
 * The view uses a label provider to define how model objects should be
 * presented in the view. Each view can present the same model objects using
 * different labels and icons, if needed. Alternatively, a single label provider
 * can be shared between views in order to ensure that objects of the same type
 * are presented in the same way everywhere.
 * <p>
 */

public class LivizConfigurationView extends ViewPart {

	/**
	 * The ID of the view as specified by the extension.
	 */
	public static final String ID = "org.gemoc.liviz.eclipse.ui.views.LivizConfigurationView";

	@Inject
	IWorkbench workbench;

	private TableViewer viewer;
	private Action action1;
	private Action action2;
	private Action doubleClickAction;

	class ViewLabelProvider extends LabelProvider implements ITableLabelProvider 
	{
		@Override
		public String getColumnText(Object obj, int index) 
		{
			return getText(obj);
		}

		@Override
		public Image getColumnImage(Object obj, int index) 
		{
			return getImage(obj);
		}

		@Override
		public Image getImage(Object obj)
		{
			return workbench.getSharedImages().getImage(ISharedImages.IMG_OBJ_ELEMENT);
		}
	}

	@Override
	public void createPartControl(Composite parent) 
	{
		final Table table = new Table(parent, SWT.SINGLE | SWT.FULL_SELECTION | SWT.HIDE_SELECTION);
	    table.setHeaderVisible(true);
	    table.setLinesVisible(true);

	    TableColumn column = new TableColumn(table, SWT.CENTER);
	    column.setText("Variable name");
	    column.pack();
	    


	      
	    // Create five table editors for color
	    TableEditor[] colorEditors = new TableEditor[5];

	    // Create five buttons for changing color
	    Button[] colorButtons = new Button[5];

	    for (int i = 0; i < 5; i++) {
	      final TableItem item = new TableItem(table, SWT.NONE);
	      colorEditors[i] = new TableEditor(table);
	      colorButtons[i] = new Button(table, SWT.CHECK);

	      colorButtons[i].setText("variable"+i);
	      colorButtons[i].computeSize(SWT.DEFAULT, table.getItemHeight());

	      colorEditors[i].grabHorizontal = true;
	      colorEditors[i].minimumHeight = colorButtons[i].getSize().y;
	      colorEditors[i].minimumWidth = colorButtons[i].getSize().x;

	      colorEditors[i].setEditor(colorButtons[i], item, 0);
	      
	      
	    }
	    
	    Button btn = new Button(parent,SWT.None);
	
	    btn.setSize(100, 500);
	    btn.setText("Start Excecution.");
	    
	    
	}
	

	private void hookContextMenu() 
	{
		
		MenuManager menuMgr = new MenuManager("#PopupMenu");
		menuMgr.setRemoveAllWhenShown(true);
		menuMgr.addMenuListener(new IMenuListener() 
		{
			public void menuAboutToShow(IMenuManager manager)
			{
				LivizConfigurationView.this.fillContextMenu(manager);
			}
		});
		Menu menu = menuMgr.createContextMenu(viewer.getControl());
		viewer.getControl().setMenu(menu);
		getSite().registerContextMenu(menuMgr, viewer);
	}

	private void contributeToActionBars() 
	{
		IActionBars bars = getViewSite().getActionBars();
		fillLocalPullDown(bars.getMenuManager());
		fillLocalToolBar(bars.getToolBarManager());
	}

	private void fillLocalPullDown(IMenuManager manager) 
	{
		manager.add(action1);
		manager.add(new Separator());
		manager.add(action2);
	}

	private void fillContextMenu(IMenuManager manager) 
	{
		manager.add(action1);
		manager.add(action2);
		// Other plug-ins can contribute there actions here
		manager.add(new Separator(IWorkbenchActionConstants.MB_ADDITIONS));
	}

	private void fillLocalToolBar(IToolBarManager manager) 
	{
		manager.add(action1);
		manager.add(action2);
	}

	private void makeActions() 
	{
		action1 = new Action() 
		{
			public void run() 
			{
				showMessage("Action 1 executed");
			}
		};
		action1.setText("Action 1");
		action1.setToolTipText("Action 1 tooltip");
		action1.setImageDescriptor(
				PlatformUI.getWorkbench().getSharedImages().getImageDescriptor(ISharedImages.IMG_OBJS_INFO_TSK));

		action2 = new Action() 
		{
			public void run() 
			{
				showMessage("Action 2 executed");
			}
		};
		action2.setText("Action 2");
		action2.setToolTipText("Action 2 tooltip");
		action2.setImageDescriptor(workbench.getSharedImages().getImageDescriptor(ISharedImages.IMG_OBJS_INFO_TSK));
		doubleClickAction = new Action() 
		{
			public void run() 
			{
				IStructuredSelection selection = viewer.getStructuredSelection();
				Object obj = selection.getFirstElement();
				showMessage("Double-click detected on " + obj.toString());
			}
		};
	}

	private void hookDoubleClickAction() {
		viewer.addDoubleClickListener(new IDoubleClickListener() {
			public void doubleClick(DoubleClickEvent event) {
				doubleClickAction.run();
			}
		});
	}

	private void showMessage(String message) {
		MessageDialog.openInformation(viewer.getControl().getShell(), "LivizConfigurationView", message);
	}

	@Override
	public void setFocus() {
		viewer.getControl().setFocus();
	}
}
